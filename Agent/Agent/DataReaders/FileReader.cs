using System.Globalization;
using Agent.Entities;

namespace Agent.DataReaders;

public class FileDataReader : IDataReader, IAsyncDisposable
{
    private FileStream _accFileStream;
    private StreamReader _accStream;
    
    private FileStream _gpsFileStream;
    private StreamReader _gpsStream;
    
    private FileStream _speedFileStream;
    private StreamReader _speedStream;
    
    public void StartRead()
    {
        ReopenGpsFile();
        ReopenAccFile();
        ReopenSpeedFile();
    }

    public void StopRead()
    {
        _accFileStream.Dispose();
        _gpsFileStream.Dispose();
    }

    public async IAsyncEnumerable<AgentMessage> Read()
    {
        int i = 0;
        float j = 0;
        while (true)
        {
            if (_accStream.EndOfStream)
                ReopenAccFile();
            
            if (_gpsStream.EndOfStream)
                ReopenGpsFile();
            
            if (_speedStream.EndOfStream)
                ReopenSpeedFile();
            
            var accStr = await _accStream.ReadLineAsync();
            var gpsStr = await _gpsStream.ReadLineAsync();
            var speedStr = await _speedStream.ReadLineAsync();
            
            i++;
            j += 0.1f;
            yield return new AgentMessage()
            {
                Accelerometer = FileParser.ParseAcc(accStr),
                Gps = FileParser.ParseGps(gpsStr),
                Speed = FileParser.ParseSpeed(speedStr),
                ClientId = "test",
                Time = DateTime.Now,
            };
        }
    }

    private void ReopenAccFile()
    {
        _accFileStream?.Dispose();
        _accStream?.Dispose();
        _accFileStream = File.OpenRead("./accelerometer.csv");
        _accStream = new StreamReader(_accFileStream);
        _accStream.ReadLine();
    }
    
    private void ReopenGpsFile()
    {
        _gpsFileStream?.Dispose();
        _gpsStream?.Dispose();
        _gpsFileStream = File.OpenRead("./gps.csv");
        _gpsStream = new StreamReader(_gpsFileStream);
        _gpsStream.ReadLine();
    }
    
    private void ReopenSpeedFile()
    {
        _speedFileStream?.Dispose();
        _speedStream?.Dispose();
        _speedFileStream = File.OpenRead("./speed.csv");
        _speedStream = new StreamReader(_speedFileStream);
        _speedStream.ReadLine();
    }

    public void Dispose()
    {
        _accFileStream.Dispose();
        _accStream.Dispose();
        _gpsFileStream.Dispose();
        _gpsStream.Dispose();
        _speedFileStream.Dispose();
        _speedStream.Dispose();
    }

    public async ValueTask DisposeAsync()
    {
        await _accFileStream.DisposeAsync();
        await CastAndDispose(_accStream);
        await _gpsFileStream.DisposeAsync();
        await CastAndDispose(_gpsStream);
        await _speedFileStream.DisposeAsync();
        await CastAndDispose(_speedStream);

        return;

        static async ValueTask CastAndDispose(IDisposable resource)
        {
            if (resource is IAsyncDisposable resourceAsyncDisposable)
                await resourceAsyncDisposable.DisposeAsync();
            else
                resource.Dispose();
        }
    }
}