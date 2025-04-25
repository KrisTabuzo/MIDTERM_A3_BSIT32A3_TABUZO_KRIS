namespace Coin_Slot_Machine.Repository
{
    using Coin_Slot_Machine.Interface;
    using Coin_Slot_Machine.Models;
    using System.Data.OleDb;

    public class PlayerRepository : IPlayerRepository
    {
        private readonly string _connectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\Users\\Kristofher\\Desktop\\Coin-Slot-Machine\\SlotMachine.accdb;";


        public bool ValidatePlayer(string studentNumber)
        {
            using var conn = new OleDbConnection(_connectionString);
            conn.Open();
            var cmd = new OleDbCommand("SELECT COUNT(*) FROM Player WHERE StudentNumber = ?", conn);
            cmd.Parameters.AddWithValue("?", studentNumber);
            return (int)cmd.ExecuteScalar() > 0;
        }

        public IEnumerable<Player> GetRecentPlayers()
        {
            using var conn = new OleDbConnection(_connectionString);
            conn.Open();
            var threshold = DateTime.Now.AddHours(-3);
            var cmd = new OleDbCommand("SELECT * FROM Player WHERE DatePlayed >= ?", conn);
            cmd.Parameters.AddWithValue("?", threshold);
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                yield return MapPlayer(reader);
            }
        }

        public IEnumerable<Player> SearchPlayers(string? studentNumber, string? firstName, string? lastName, string? outcome, DateTime? datePlayed)
        {
            var query = "SELECT * FROM Player WHERE 1=1";
            var parameters = new List<OleDbParameter>();

            if (!string.IsNullOrEmpty(studentNumber))
            {
                query += " AND StudentNumber = ?";
                parameters.Add(new OleDbParameter("?", studentNumber));
            }
            if (!string.IsNullOrEmpty(firstName))
            {
                query += " AND FirstName = ?";
                parameters.Add(new OleDbParameter("?", firstName));
            }
            if (!string.IsNullOrEmpty(lastName))
            {
                query += " AND LastName = ?";
                parameters.Add(new OleDbParameter("?", lastName));
            }
            if (!string.IsNullOrEmpty(outcome))
            {
                query += " AND Outcome = ?";
                parameters.Add(new OleDbParameter("?", outcome));
            }
            if (datePlayed.HasValue)
            {
                query += " AND DatePlayed = ?";
                parameters.Add(new OleDbParameter("?", datePlayed));
            }

            using var conn = new OleDbConnection(_connectionString);
            conn.Open();
            var cmd = new OleDbCommand(query, conn);
            cmd.Parameters.AddRange(parameters.ToArray());

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                yield return MapPlayer(reader);
            }
        }

        private Player MapPlayer(OleDbDataReader reader)
        {
            return new Player
            {
                StudentNumber = reader["StudentNumber"].ToString(),
                FirstName = reader["FirstName"].ToString(),
                LastName = reader["LastName"].ToString(),
                Outcome = reader["Outcome"].ToString(),
                DatePlayed = Convert.ToDateTime(reader["DatePlayed"])
            };
        }

        public IEnumerable<Player> GetAllPlayers()
        {
            using var conn = new OleDbConnection(_connectionString);
            conn.Open();
            var cmd = new OleDbCommand("SELECT * FROM Player", conn);
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                yield return MapPlayer(reader);
            }
        }


        public void AddPlayer(Player player)
        {
            using var conn = new OleDbConnection(_connectionString);
            conn.Open();

            var cmd = new OleDbCommand("INSERT INTO Player (StudentNumber, FirstName, LastName, Outcome, DatePlayed) VALUES (?, ?, ?, ?, ?)", conn);


            cmd.Parameters.AddWithValue("@StudentNumber", player.StudentNumber);
            cmd.Parameters.AddWithValue("@FirstName", player.FirstName);
            cmd.Parameters.AddWithValue("@LastName", player.LastName);
            cmd.Parameters.AddWithValue("@Outcome", player.Outcome);
            cmd.Parameters.AddWithValue("@DatePlayed", player.DatePlayed.ToString("yyyy-MM-dd HH:mm:ss"));
            cmd.ExecuteNonQuery();
        }



        public List<Player> GetPlayersByStudentNumber(string studentNumber)
        {
            var players = new List<Player>();

            using (var connection = new OleDbConnection(_connectionString))
            {
                connection.Open();
                var query = "SELECT * FROM Player WHERE StudentNumber = ?";
                using (var command = new OleDbCommand(query, connection))
                {
                    command.Parameters.AddWithValue("?", studentNumber);
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            players.Add(new Player
                            {
                                StudentNumber = reader["StudentNumber"].ToString(),
                                FirstName = reader["FirstName"].ToString(),
                                LastName = reader["LastName"].ToString(),
                                Outcome = reader["Outcome"].ToString(),
                                DatePlayed = Convert.ToDateTime(reader["DatePlayed"])
                            });
                        }
                    }
                }
            }

            return players;
        }


        public void UpdateGameResult(string studentNumber, string outcome, DateTime datePlayed)
        {
            using (OleDbConnection connection = new OleDbConnection(_connectionString))
            {
                connection.Open();
                string query = "UPDATE Player SET Outcome = ?, DatePlayed = ? WHERE StudentNumber = ?";
                using (OleDbCommand command = new OleDbCommand(query, connection))
                {
                    command.Parameters.Add(new OleDbParameter { OleDbType = OleDbType.VarWChar, Value = outcome });
                    command.Parameters.Add(new OleDbParameter { OleDbType = OleDbType.Date, Value = datePlayed });
                    command.Parameters.Add(new OleDbParameter { OleDbType = OleDbType.VarWChar, Value = studentNumber });

                    command.ExecuteNonQuery();
                }
            }
        }
        public IEnumerable<Player> GetWinners()
        {
            using var conn = new OleDbConnection(_connectionString);
            conn.Open();
            var cmd = new OleDbCommand("SELECT * FROM Player WHERE Outcome = 'Win'", conn);
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                yield return MapPlayer(reader);
            }
        }

        public IEnumerable<Player> GetLosers()
        {
            using var conn = new OleDbConnection(_connectionString);
            conn.Open();
            var cmd = new OleDbCommand("SELECT * FROM Player WHERE Outcome = 'Lose'", conn);
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                yield return MapPlayer(reader);
            }
        }

    }

}
