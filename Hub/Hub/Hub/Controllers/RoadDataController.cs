using Edge.Entities;
using Hub.Services;
using Microsoft.AspNetCore.Mvc;

namespace Hub.Controllers;

[ApiController]
public class RoadDataController(StoreService storeService) : ControllerBase
{
    [HttpPost("roadData")]
    public async Task<IActionResult> SaveRoadData(ProcessedAgentData data)
    {
        await storeService.SaveData(data);
        return Ok();
    }
}