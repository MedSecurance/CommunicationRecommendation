using MediatR;
using MedSecurance.DeviceManager.Queries;
using MedSecurance.DeviceManager.Repositories.Interfaces;

namespace MedSecurance.DeviceManager.Handlers;

public class GetDevicesQueryHandler : IRequestHandler<GetDevicesQuery, GetDevicesQueryResponse>
{
    private readonly ILogger<GetDevicesQueryHandler> _logger;
    private readonly IDeviceRepository _repository;

    public GetDevicesQueryHandler(ILogger<GetDevicesQueryHandler> logger, IDeviceRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }

    public async Task<GetDevicesQueryResponse> Handle(GetDevicesQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling {@RequestType}", nameof(GetDevicesQuery));

        var devices = await _repository.GetAllDevicesAsync(request);
        
        _logger.LogInformation("Returning total of {@TotalDevices} devices", devices.Count());
        
         return new GetDevicesQueryResponse(devices);
    }  
}