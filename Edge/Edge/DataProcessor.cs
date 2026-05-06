using System.Diagnostics;
using Edge.Adapters;
using Edge.Entities;
using Edge.Metrics;

namespace Edge;

public class DataProcessor(AgentAdapter agentAdapter, HubAdapter hubAdapter)
{
    public async Task Start()
    {
        await agentAdapter.StartReading(async message =>
        {
            var sw = Stopwatch.StartNew();
            var res = ProcessMessage(message);
            sw.Stop();
            EdgeMetrics.ProcessingDuration.Observe(sw.Elapsed.TotalSeconds);
            EdgeMetrics.MessagesProcessed.WithLabels(res.RoadState ?? "unknown").Inc();
            EdgeMetrics.LastSpeed.WithLabels(message.ClientId ?? "unknown").Set(message.Speed);

            await hubAdapter.SendData(res);
        });
    }

    public static ProcessedAgentData ProcessMessage(AgentMessage message)
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
