using Edge.Adapters;
using Edge.Entities;

namespace Edge;

public class DataProcessor(AgentAdapter agentAdapter, HubAdapter hubAdapter)
{
    public async Task Start()
    {
        await agentAdapter.StartReading(async message =>
        {
            var res = ProcessMessage(message);
            await hubAdapter.SendData(res);
        });
    }

    private ProcessedAgentData ProcessMessage(AgentMessage message)
    {
        var defauldVal = 16000;
        var roadState = "";
        var val = Math.Abs(message.Accelerometer.Z - defauldVal);
        if (val > 18000)
        {
            roadState = "Baaad";
        } 
        else if (val > 12000)
        {
            roadState = "Bad";
        }
        else if (val > 4000)
        {
            roadState = "Normal";
        }
        else if (val > 2000)
        {
            roadState = "Ok";
        }
        else
        {
            roadState = "Good";
        }

        return new ProcessedAgentData()
        {
            RoadState = roadState,
            AgentMessage = message,
        };
    }
}