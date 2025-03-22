namespace Edge.Entities;

public class AgentMessage
{
    public Accelerometer Accelerometer { get; set; }
    public Gps Gps { get; set; }
    public float Speed { get; set; }
    public DateTime Time { get; set; }
    public string ClientId { get; set; }
}