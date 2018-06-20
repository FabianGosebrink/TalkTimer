namespace TimerTalk.API.Dto
{
    public class TimerTickCreateDto
    {
        public string Topic { get; set; }
        public int IntervalSeconds { get; set; }
        public int SecondsLeft { get; set; }
    }
}
