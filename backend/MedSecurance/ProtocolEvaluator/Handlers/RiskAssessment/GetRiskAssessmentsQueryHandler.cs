using MediatR;
using MedSecurance.ProtocolEvaluator.Queries;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;

namespace MedSecurance.ProtocolEvaluator.Handlers.RiskAssessment;

public class GetRiskAssessmentsQueryHandler : IRequestHandler<GetRiskAssessmentsQuery, GetRiskAssessmentsQueryResponse>
{
    private readonly ILogger<GetRiskAssessmentsQueryHandler> _logger;
    private readonly IRiskAssessmentRepository _repository;

    public GetRiskAssessmentsQueryHandler(ILogger<GetRiskAssessmentsQueryHandler> logger, IRiskAssessmentRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }

    public async Task<GetRiskAssessmentsQueryResponse> Handle(GetRiskAssessmentsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling {@RequestType}", nameof(GetRiskAssessmentsQuery));
        
        var riskAssessments = await _repository.GetRiskAssessmentsAsync();
        
        _logger.LogInformation("Returning total of {@TotalRiskAssessments} risk assessments", riskAssessments.Count);
        
        return new GetRiskAssessmentsQueryResponse(riskAssessments);
    }
}