using System;
using System.Collections.Generic;

namespace TimerTalk.API.Models
{
    public class Talk
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Added { get; set; }

        public List<TimerTick> TimerTicks { get; set; }
    }
}
