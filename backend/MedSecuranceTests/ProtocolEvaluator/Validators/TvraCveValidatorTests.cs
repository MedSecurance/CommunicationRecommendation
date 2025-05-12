using MedSecurance.ProtocolEvaluator.Models.Wifi;
using MedSecurance.ProtocolEvaluator.Validators;

namespace MedSecuranceTests.ProtocolEvaluator.Validators;

public class TvraCveValidatorTests
{
    private readonly TvraCveValidator _validator = new();
    
    private readonly TvraCve _tvraCve = new()
    {
        Host = "10.10.1.114",
        Port = "general/tcp",
        Severity = 10m,
        QoD = 80,
        Text = "The Ubuntu Operating System on the remote host has reached the end of life."
    };

    [Fact]
    public async Task Validate_ValidTvraCve_ReturnsTrue()
    {
        Assert.True((await _validator.ValidateAsync(_tvraCve)).IsValid);
    }
    
    [Fact]
    public async Task Validate_EmptyTvraCveHost_ReturnsFalse()
    {
        // Arrange
        _tvraCve.Host = string.Empty;
        
        // Act
        var validationResult = await _validator.ValidateAsync(_tvraCve);
        
        Assert.False(validationResult.IsValid);
        Assert.Single(validationResult.Errors);
        Assert.Equal("TvraCve Host cannot be empty", validationResult.Errors[0].ErrorMessage);
    }
    
    [Fact]
    public async Task Validate_EmptyTvraCvePort_ReturnsFalse()
    {
        // Arrange
        _tvraCve.Port = string.Empty;
        
        // Act
        var validationResult = await _validator.ValidateAsync(_tvraCve);
        
        Assert.False(validationResult.IsValid);
        Assert.Single(validationResult.Errors);
        Assert.Equal("TvraCve Port cannot be empty", validationResult.Errors[0].ErrorMessage);
    }

    [Theory]
    [InlineData(-0.1)]
    [InlineData(-1)]
    [InlineData(10.1)]
    [InlineData(11)]
    public async Task Validate_InvalidTvraCveSeverity_ReturnsFalse(decimal severity)
    {
        _tvraCve.Severity = severity;
        
        // Act
        var validationResult = await _validator.ValidateAsync(_tvraCve);
        
        Assert.False(validationResult.IsValid);
        Assert.Single(validationResult.Errors);
        Assert.Equal("TvraCve Severity must be between 0 and 10", validationResult.Errors[0].ErrorMessage);
    }
    
    [Theory]
    [InlineData(-1)]
    [InlineData(101)]
    public async Task Validate_InvalidTvraCveQoD_ReturnsFalse(int qod)
    {
        _tvraCve.QoD = qod;
        
        // Act
        var validationResult = await _validator.ValidateAsync(_tvraCve);
        
        Assert.False(validationResult.IsValid);
        Assert.Single(validationResult.Errors);
        Assert.Equal("TvraCve QoD must be between 0 and 100", validationResult.Errors[0].ErrorMessage);
    }
    
    [Fact]
    public async Task Validate_EmptyTvraCveText_ReturnsFalse()
    {
        // Arrange
        _tvraCve.Text = string.Empty;
        
        // Act
        var validationResult = await _validator.ValidateAsync(_tvraCve);
        
        Assert.False(validationResult.IsValid);
        Assert.Single(validationResult.Errors);
        Assert.Equal("TvraCve Text cannot be empty", validationResult.Errors[0].ErrorMessage);
    }
}