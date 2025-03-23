using System.Collections.Concurrent;
using System.Text.Json;
using Edge.Entities;

namespace Hub.Services;

public class StoreService
{
    private readonly IStoreAdapter _store;
    private ConcurrentQueue<ProcessedAgentData> _messages = new();
    private readonly HttpClient _client = new();
    
    public StoreService(IStoreAdapter store)
    {
        _store = store;
        StartSaving();
    }
    
    public async Task SaveData(ProcessedAgentData? processedAgentData) => _messages.Enqueue(processedAgentData);

    private async Task StartSaving()
    {
        var toSave = new List<ProcessedAgentData>(10);
        while (true)
        {
            try
            {
                while (true)
                {
                    if (toSave.Count >= 10)
                    {
                        await Save(toSave);
                        toSave.Clear();
                    }

                    if (!_messages.TryDequeue(out ProcessedAgentData processedAgentData))
                    {
                        break;
                    }
                    toSave.Add(processedAgentData);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            finally
            {
                await Task.Delay(1);
            }
        }
    }

    private async Task Save(IEnumerable<ProcessedAgentData> data)
    {
        await _store.Save(data);
    }
}