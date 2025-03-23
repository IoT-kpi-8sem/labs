using Edge.Entities;

namespace Hub.Services;

public interface IStoreAdapter
{
    public Task Save(IEnumerable<ProcessedAgentData> data);
}