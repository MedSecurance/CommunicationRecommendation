using MediatR;
using MedSecurance.DeviceManager.Models;
using MedSecurance.DeviceManager.Queries;
using MedSecurance.DeviceManager.Repositories.Interfaces;

namespace MedSecurance.DeviceManager.Handlers;

public class GetDeviceByIdQueryHandler : IRequestHandler<GetDeviceByIdQuery, Device>
{
    private readonly IDeviceRepository _repository;

    public GetDeviceByIdQueryHandler(IDeviceRepository repository)
    {
        _repository = repository;
    }

    public async Task<Device> Handle(GetDeviceByIdQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetDeviceByIdAsync(request.Id);
    }
}