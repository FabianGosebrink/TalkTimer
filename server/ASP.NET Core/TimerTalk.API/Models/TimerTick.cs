using System;

namespace TimerTalk.API.Models
{
    public class TimerTick
    {
        public Guid Id { get; set; }
        public string Topic { get; set; }
        public int intervalSeconds { get; set; }
        public int secondsLeft { get; set; }

        public int TalkId { get; set; }
        public Talk Talk { get; set; }
    }
}
