using MedSecurance.Extensions;
using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Wifi;
using MedSecurance.ProtocolEvaluator.Queries;
using MigraDocCore.DocumentObjectModel;
using MigraDocCore.Rendering;

namespace MedSecurance.ProtocolEvaluator.PdfReport;

public static class PdfReportGenerator
{
    public static byte[] GenerateReport(GeneratePdfReportQuery query)
    {
        var document = new Document
        {
            Info =
            {
                Title = "Risk Assessment Report"
            }
        };

        var section = document.AddSection();

        void AddSectionTitle(string text)
        {
            var title = section.AddParagraph(text);
            title.Format.Font.Size = 16;
            title.Format.Font.Bold = true;
            title.Format.SpaceBefore = "0.5cm";
            title.Format.SpaceAfter = "0.3cm";
        }

        void AddSuggestions(string header, ICollection<EvaluationSuggestion> items)
        {
            AddSectionTitle(header);

            if (items.IsNullOrEmpty())
            {
                var p = section.AddParagraph();
                p.Format.SpaceAfter = "0.2cm";
                p.Format.Font.Size = 11;
                p.AddText($"No {header.ToLower()} available.");

                return;
            }

            foreach (var item in items)
            {
                var p = section.AddParagraph();
                p.Format.SpaceAfter = "0.2cm";
                p.Format.Font.Size = 11;
                p.AddFormattedText($"({item.Weight}) ", TextFormat.Bold);
                p.AddText(item.Message);
            }
        }
        
        void AddTvraCveSuggestions(string header, ICollection<TvraCve>? items)
        {
            AddSectionTitle(header);

            if (items.IsNullOrEmpty())
            {
                var p = section.AddParagraph();
                p.Format.SpaceAfter = "0.2cm";
                p.Format.Font.Size = 11;
                p.AddText($"No {header.ToLower()} available.");

                return;
            }

            foreach (var item in items)
            {
                var p = section.AddParagraph();
                p.Format.SpaceAfter = "0.2cm";
                p.Format.Font.Size = 11;
                
                p.AddFormattedText($"({item.Severity}) ", TextFormat.Bold);

                var hostText = string.IsNullOrEmpty(item.Host)
                    ? string.Empty
                    : $"Host: {item.Host} - ";
                
                p.AddText($"{hostText}{item.Text}");
            }
        }

        // Mitigations
        AddSuggestions("Mitigations", query.Mitigations);

        // Safe configs
        AddSuggestions("Safe Configurations", query.SafeConfigs);

        // Protocol replacements
        AddSuggestions("Protocol Replacements", query.Replacements.Suggestions);
        
        // Vulnerabilities
        AddTvraCveSuggestions("Vulnerabilities", query.Vulnerabilities);

        var renderer = new PdfDocumentRenderer(unicode: true)
        {
            Document = document
        };

        renderer.RenderDocument();

        using var stream = new MemoryStream();
        renderer.Save(stream, false);
        return stream.ToArray();
    }
}