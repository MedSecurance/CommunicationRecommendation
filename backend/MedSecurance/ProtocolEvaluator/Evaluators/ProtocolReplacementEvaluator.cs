using MedSecurance.DeviceManager.Models;
using MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;
using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Utils;

namespace MedSecurance.ProtocolEvaluator.Evaluators;

public class ProtocolReplacementEvaluator : IProtocolReplacementEvaluator
{
    private readonly IReadOnlyCollection<Protocol> _implementedProtocols =
        [Protocol.Bluetooth, Protocol.WiFi, Protocol.GSM, Protocol.LoraWan];

    private readonly IReadOnlyCollection<Protocol> _maxDistance =
        [Protocol.Bluetooth, Protocol.WiFi, Protocol.GSM, Protocol.LoraWan];

    private readonly IReadOnlyCollection<Protocol> _maxBandwidth =
        [Protocol.LoraWan, Protocol.Bluetooth, Protocol.GSM, Protocol.WiFi];

    private readonly IReadOnlyCollection<Protocol> _maxSecurity =
        [Protocol.LoraWan, Protocol.Bluetooth, Protocol.GSM, Protocol.WiFi];

    private readonly ProtocolReplacementEvaluationResult _result = new();

    public ProtocolReplacementEvaluationResult Evaluate(
        string networkName,
        Protocol utizilizedProtocol, 
        ICollection<Device> devices,
        bool alreadyImplemented
    )
    {
        if(!devices.Any())
            return _result;
        
        var alternativeProtocols = DetectSupportedProtocols(devices);
        
        var maxSupportedDevices = alternativeProtocols.Values.Min(p => p.Count);

        var partiallySupported = FindPartiallySupportedProtocols(alternativeProtocols, utizilizedProtocol, devices.Count);

        var alternativeProtocolsSet = new HashSet<Protocol>(alternativeProtocols.Keys);

        var haveSuggestions = false;

        if (maxSupportedDevices < devices.Count && partiallySupported.Count > 0)
        {
            _result.Title = "Not all alternative protocols are supported by all devices. Suggest only the common ones.";
            alternativeProtocolsSet.IntersectWith(partiallySupported);
            haveSuggestions = true;
        }
        else if (maxSupportedDevices == devices.Count)
        {
            _result.Title = "All alternative protocols are supported by all devices.";
            haveSuggestions = true;
        }
        else if (alreadyImplemented)
        {
            _result.Title = "No common alternative protocols found to be supported by all devices.";
        }

        if (haveSuggestions)
        {
            GenerateSuggestions(utizilizedProtocol, alternativeProtocolsSet, networkName);
        }
        else if (!alreadyImplemented)
        {
            _result.Title = "Since your network is not currently implemented. We suggest the following generic protocol replacement suggestions.";
            alternativeProtocolsSet = new HashSet<Protocol>(_implementedProtocols);
            alternativeProtocolsSet.Remove(utizilizedProtocol);
            GenerateGenericSuggestions(utizilizedProtocol, networkName);
        }

        return _result;
    }

    private Dictionary<Protocol, List<Guid>> DetectSupportedProtocols(ICollection<Device> devices)
    {
        var alternativeProtocols = new Dictionary<Protocol, List<Guid>>();

        foreach (var d in devices)
        {
            if (d.SupportedCommunicationProtocols is null) continue;

            foreach (var p in d.SupportedCommunicationProtocols)
            {
                if (!alternativeProtocols.ContainsKey(p))
                {
                    alternativeProtocols[p] = [];
                }

                alternativeProtocols[p].Add(d.Id);
            }
        }

        return alternativeProtocols;
    }

    private List<Protocol> FindPartiallySupportedProtocols(Dictionary<Protocol, List<Guid>> alternativeProtocols,
        Protocol utizilizedProtocol, int totalNetworkDevices)
    {
        return alternativeProtocols.Keys
            .Where(p => p != utizilizedProtocol)
            .Where(p => alternativeProtocols[p].Count == totalNetworkDevices)
            .ToList();
    }

    private void GenerateSuggestions(Protocol utizilizedProtocol, HashSet<Protocol> alternativeProtocolsSet,
        string networkName)
    {
        var maxDistance = DetectUpgradesFromList(utizilizedProtocol, _maxDistance.ToList());
        maxDistance.IntersectWith(alternativeProtocolsSet);
        if (maxDistance.Count > 0)
        {
            SuggestionUtils.AddSuggestion(
                _result.Suggestions,
                $"Protocol Replacement - Maximize transmission distance: Consider switching to the following communication protocol(s) in the following order to maximize your transmission distance '{string.Join(", ", maxDistance)}' since all devices attached to the '{networkName}' network are currently supporting them.",
                3
            );
        }

        var maxBandwidth = DetectUpgradesFromList(utizilizedProtocol, _maxBandwidth.ToList());
        maxBandwidth.IntersectWith(alternativeProtocolsSet);
        if (maxBandwidth.Count > 0)
        {
            SuggestionUtils.AddSuggestion(
                _result.Suggestions,
                $"Protocol Replacement - Maximize data transmission volume: Consider switching to the following communication protocol(s) in the following order to maximize your data transmission volume '{string.Join(", ", maxBandwidth)}' since all devices attached to the '{networkName}' network are currently supporting them.",
                4
            );
        }

        var maxSecurity = DetectUpgradesFromList(utizilizedProtocol, _maxSecurity.ToList());
        maxSecurity.IntersectWith(alternativeProtocolsSet);
        if (maxSecurity.Count > 0)
        {
            SuggestionUtils.AddSuggestion(
                _result.Suggestions,
                $"Protocol Replacement - Maximize data on transit security: Consider switching to the following communication protocol(s) in the following order to maximize your data on transit security '{string.Join(", ", maxSecurity)}' since all devices attached to the '{networkName}' network are currently supporting them.",
                5
            );
        }
    }

    private void GenerateGenericSuggestions(Protocol utizilizedProtocol, string networkName)
    {
        var maxDistance = DetectUpgradesFromList(utizilizedProtocol, _maxDistance.ToList());
        if (maxDistance.Count > 0)
        {
            SuggestionUtils.AddSuggestion(
                _result.Suggestions,
                $"Protocol Replacement - Maximize transmission distance: Consider switching to the following communication protocol(s) in the following order to maximize your transmission distance '{string.Join(", ", maxDistance)}' for the '{networkName}' network.",
                3
            );
        }

        var maxBandwidth = DetectUpgradesFromList(utizilizedProtocol, _maxBandwidth.ToList());
        if (maxBandwidth.Count > 0)
        {
            SuggestionUtils.AddSuggestion(
                _result.Suggestions,
                $"Protocol Replacement - Maximize data transmission volume: Consider switching to the following communication protocol(s) in the following order to maximize your data transmission volume '{string.Join(", ", maxBandwidth)}' for the '{networkName}' network.",
                4
            );
        }

        var maxSecurity = DetectUpgradesFromList(utizilizedProtocol, _maxSecurity.ToList());
        if (maxSecurity.Count > 0)
        {
            SuggestionUtils.AddSuggestion(
                _result.Suggestions,
                $"Protocol Replacement - Maximize data on transit security: Consider switching to the following communication protocol(s) in the following order to maximize your data on transit security '{string.Join(", ", maxSecurity)}' for the '{networkName}' network.",
                5
            );
        }
    }

    private HashSet<Protocol> DetectUpgradesFromList(Protocol utizilizedProtocol, List<Protocol> options)
    {
        int idx = options.IndexOf(utizilizedProtocol);
        if (idx < options.Count)
        {
            options.RemoveAt(idx);
            return new HashSet<Protocol>(options.Skip(idx).Reverse());
        }

        return new HashSet<Protocol>();
    }
}