using AutoFixture;
using MedSecurance.DeviceManager.Models;
using MedSecurance.DeviceManager.Queries;
using MedSecurance.DeviceManager.Repositories.Interfaces;
using MedSecurance.ProtocolEvaluator.Commands;
using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Evaluators;
using MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Queries;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;

namespace MedSecuranceTests.ProtocolEvaluator.Evaluators;

public class WifiEvaluatorTests
{
    private readonly WifiEvaluator _wifiEvaluator;
    private readonly Mock<IDeviceRepository> _deviceRepositoryMock = new(MockBehavior.Strict);
    private readonly Mock<IAdminConfigRepository> _adminConfigRepositoryMock = new(MockBehavior.Strict);

    public WifiEvaluatorTests()
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", false, true)
            .Build();

        var protocolEvaluatorConfig = new ProtocolEvaluatorConfig();
        configuration.GetSection("ProtocolEvaluator").Bind(protocolEvaluatorConfig);

        _wifiEvaluator = new WifiEvaluator(
            Mock.Of<ILogger<WifiEvaluator>>(),
            Options.Create(protocolEvaluatorConfig),
            _deviceRepositoryMock.Object,
            _adminConfigRepositoryMock.Object,
            Mock.Of<IProtocolReplacementEvaluator>());
    }

    [Fact]
    public async Task Evaluate_WhenEvaluateWifiCommandIsEmpty_ShouldReturnSuggestions()
    {
        // Arrange
        var wifiCommand = new Fixture()
            .Build<EvaluateWifiCommand>()
            .With(x => x.IpRange, "127.0.0.1/24")
            .With(x => x.FirewallEnabled, false)
            .Create();

        var adminConfigMock = new List<AdminConfig>()
        {
            new()
            {
                Protocol = Protocol.WiFi,
                Property = "MeanDowntimeInMinutes",
                Value = "30"
            }
        };

        _adminConfigRepositoryMock
            .Setup(x => x.GetAdminConfigsAsync(
                It.Is<GetAdminConfigsQuery>(q =>
                    q.CommunicationProtocol == Protocol.WiFi
                )
            ))
            .ReturnsAsync(adminConfigMock);

        _deviceRepositoryMock
            .Setup(x => x.GetAllDevicesAsync(
                It.Is<GetDevicesQuery>(q =>
                    q.CommunicationProtocol == Protocol.WiFi &&
                    q.NetworkName == wifiCommand.NetworkName
                )
            ))
            .ReturnsAsync(new List<Device>());

        // Act
        var result = await _wifiEvaluator.Evaluate(wifiCommand);

        // Assert
        _adminConfigRepositoryMock.VerifyAll();
        
        Assert.Equal(14, result.Mitigations.Count);
        Assert.Equal(15, result.SafeConfigs.Count);
    }
}