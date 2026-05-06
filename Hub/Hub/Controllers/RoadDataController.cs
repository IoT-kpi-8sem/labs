using Edge.Entities;
using Hub.Metrics;
using Hub.Services;
using Microsoft.AspNetCore.Mvc;

namespace Hub.Controllers;

[ApiController]
public class RoadDataController(StoreService storeService) : ControllerBase
{
    [HttpPost("roadData")]
    public async Task<IActionResult> SaveRoadData(ProcessedAgentData data)
    {
        HubMetrics.RoadDataReceived.WithLabels(data.RoadState ?? "unknown").Inc();
        await storeService.SaveData(data);
        return Ok();
    }
}
