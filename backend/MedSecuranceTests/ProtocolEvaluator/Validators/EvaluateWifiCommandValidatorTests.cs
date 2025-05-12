using AutoFixture;
using MedSecurance.ProtocolEvaluator.Commands;
using MedSecurance.ProtocolEvaluator.Models.Wifi;
using MedSecurance.ProtocolEvaluator.Validators;

namespace MedSecuranceTests.ProtocolEvaluator.Validators;

public class EvaluateWifiCommandValidatorTests
{
    private readonly EvaluateWifiCommandValidator _validator = new();

    [Fact]
    public async Task Validate_NullTvraCves_ReturnsTrue()
    {
        // Arrange
        var command = new Fixture()
            .Build<EvaluateWifiCommand>()
            .With(x => x.TvraCves, () => null)
            .Create();
        
        // Act
        var validateResult = await _validator.ValidateAsync(command);
        
        // Assert
        Assert.True(validateResult.IsValid);
    }
    
    [Fact]
    public async Task Validate_EmptyTvraCves_ReturnsTrue()
    {
        // Arrange
        var command = new Fixture()
            .Build<EvaluateWifiCommand>()
            .With(x => x.TvraCves, [])
            .Create();
        
        // Act
        var validateResult = await _validator.ValidateAsync(command);
        
        // Assert
        Assert.True(validateResult.IsValid);
    }
    
    [Fact]
    public async Task Validate_ValidTvraCves_ReturnsTrue()
    {
        // Arrange
        var tvraCve = new TvraCve
        {
            Host = "10.10.1.114",
            Port = "general/tcp",
            Severity = 10m,
            QoD = 80,
            Text = "The Ubuntu Operating System on the remote host has reached the end of life."
        };

        var command = new Fixture()
            .Build<EvaluateWifiCommand>()
            .With(x => x.TvraCves, [tvraCve])
            .Create();
        
        // Act
        var validateResult = await _validator.ValidateAsync(command);
        
        // Assert
        Assert.True(validateResult.IsValid);
    }
    
    [Fact]
    public async Task Validate_InvalidTvraCves_ReturnsFalse()
    {
        // Arrange
        var tvraCve = new TvraCve
        {
            Host = string.Empty,
            Port = "general/tcp",
            Severity = 10m,
            QoD = 80,
            Text = "The Ubuntu Operating System on the remote host has reached the end of life."
        };

        var command = new Fixture()
            .Build<EvaluateWifiCommand>()
            .With(x => x.TvraCves, [tvraCve])
            .Create();
        
        // Act
        var validateResult = await _validator.ValidateAsync(command);
        
        // Assert
        Assert.False(validateResult.IsValid);
        Assert.Single(validateResult.Errors);
        Assert.Equal("TvraCve Host cannot be empty", validateResult.Errors[0].ErrorMessage);
    }
}