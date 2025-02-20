using Agent.Entities;

namespace Agent.DataReaders;

public interface IDataReader : IDisposable
{
    void StartRead();
    void StopRead();
    IAsyncEnumerable<AgentMessage> Read();
}