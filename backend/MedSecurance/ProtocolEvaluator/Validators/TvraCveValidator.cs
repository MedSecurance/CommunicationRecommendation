using FluentValidation;
using MedSecurance.ProtocolEvaluator.Models.Wifi;

namespace MedSecurance.ProtocolEvaluator.Validators;

public class TvraCveValidator : AbstractValidator<TvraCve>
{
    public TvraCveValidator()
    {
        RuleFor(x => x.Host)
            .NotEmpty()
            .WithMessage("TvraCve Host cannot be empty");
        
        RuleFor(x => x.Port)
            .NotEmpty()
            .WithMessage("TvraCve Port cannot be empty");
        
        RuleFor(x => x.Severity)
            .InclusiveBetween(0, 10)
            .WithMessage("TvraCve Severity must be between 0 and 10");
        
        RuleFor(x => x.QoD)
            .InclusiveBetween(0, 100)
            .WithMessage("TvraCve QoD must be between 0 and 100");
        
        RuleFor(x => x.Text)
            .NotEmpty()
            .WithMessage("TvraCve Text cannot be empty");
    }
}