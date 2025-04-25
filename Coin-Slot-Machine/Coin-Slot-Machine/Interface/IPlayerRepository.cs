using Coin_Slot_Machine.Models;

namespace Coin_Slot_Machine.Interface
{
    public interface IPlayerRepository
    {
        IEnumerable<Player> GetWinners();
        IEnumerable<Player> GetLosers();
        bool ValidatePlayer(string studentNumber);
        IEnumerable<Player> GetRecentPlayers();
        IEnumerable<Player> SearchPlayers(string? studentNumber, string? firstName, string? lastName, string? outcome, DateTime? datePlayed);
        IEnumerable<Player> GetAllPlayers();
        List<Player> GetPlayersByStudentNumber(string studentNumber);
        void AddPlayer(Player player);
        void UpdateGameResult(string studentNumber, string outcome, DateTime datePlayed);




    }
}
