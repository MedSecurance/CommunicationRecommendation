using FluentValidation;
using MedSecurance.Extensions;
using MedSecurance.ProtocolEvaluator.Commands;

namespace MedSecurance.ProtocolEvaluator.Validators;

public class EvaluateWifiCommandValidator : AbstractValidator<EvaluateWifiCommand>
{
    public EvaluateWifiCommandValidator()
    {
        RuleForEach(x => x.TvraCves)
            .SetValidator(new TvraCveValidator())
            .When(x => !x.TvraCves.IsNullOrEmpty());
    }
}