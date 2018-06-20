namespace TimerTalk.API
{
    public class TimerTickUpdateDto
    {
        public string Topic { get; set; }
        public int IntervalSeconds { get; set; }
        public int SecondsLeft { get; set; }
    }
}
