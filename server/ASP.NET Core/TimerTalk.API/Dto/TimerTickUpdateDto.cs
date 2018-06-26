namespace TimerTalk.API.Dto
{
    public class TimerTickUpdateDto
    {
        public string Topic { get; set; }
        public int IntervalSeconds { get; set; }
        public int Position { get; set; }
    }
}
