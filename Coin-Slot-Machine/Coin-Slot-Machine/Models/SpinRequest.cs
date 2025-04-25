namespace Coin_Slot_Machine.Models
{
    public class SpinRequest
    {
        public string StudentNumber { get; set; }
        public string Outcome { get; set; } // "Win" or "Lose"
    }
}