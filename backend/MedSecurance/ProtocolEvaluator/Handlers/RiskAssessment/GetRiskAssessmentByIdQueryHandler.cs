using MediatR;
using MedSecurance.ProtocolEvaluator.Queries;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;

namespace MedSecurance.ProtocolEvaluator.Handlers.RiskAssessment;

public class GetRiskAssessmentByIdQueryHandler : IRequestHandler<GetRiskAssessmentByIdQuery, GetRiskAssessmentByIdQueryResponse>
{
    private readonly ILogger<GetRiskAssessmentByIdQueryHandler> _logger;
    private readonly IRiskAssessmentRepository _repository;

    public GetRiskAssessmentByIdQueryHandler(ILogger<GetRiskAssessmentByIdQueryHandler> logger, IRiskAssessmentRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }

    public async Task<GetRiskAssessmentByIdQueryResponse> Handle(GetRiskAssessmentByIdQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling {@RequestType}", nameof(GetRiskAssessmentByIdQuery));
        
        var riskAssessment = await _repository.GetRiskAssessmentByIdAsync(request.Id);

        return new GetRiskAssessmentByIdQueryResponse(riskAssessment);
    }
}