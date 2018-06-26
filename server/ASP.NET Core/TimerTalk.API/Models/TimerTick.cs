using System;

namespace TimerTalk.API.Models
{
    public class TimerTick
    {
        public int Id { get; set; }
        public string Topic { get; set; }
        public int IntervalSeconds { get; set; }
        public int SecondsLeft { get; set; }
        public string UserId { get; set; }
        public int Index { get; set; }

        public int TalkId { get; set; }
        public Talk Talk { get; set; }
    }
}
