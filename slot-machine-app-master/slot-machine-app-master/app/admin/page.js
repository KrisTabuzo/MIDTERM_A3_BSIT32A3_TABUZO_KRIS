
"use client";

import React, { useState } from 'react';
const Admin = () => {

  const [studentNumber, setStudentNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [players, setPlayers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [isPasswordSet, setisPasswordSet] = useState(false); // Has the user entered their name?

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!/^C/i.test(studentNumber)) {
      setError("Student number must start with the letter 'C'");
      return;
    }
    setError("");

    // check if user already exists
    try {
      const validateResponse = await fetch(`https://localhost:7090/Player/validate/${studentNumber}`);

      if (!validateResponse.ok) {
        throw new Error('Failed to validate user');
      }

      const exists = await validateResponse.json();

      if (exists) {
        alert('Student already exists.');
        return;
      }

     
      const newUser = {
        studentNumber,
        firstName,
        lastName,
        outcome: "N/A", 
        datePlayed: "1900-01-01T00:00:00" 
      };

      const response = await fetch('https://localhost:7090/Player/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        throw new Error('Failed to register user');
      }

      const data = await response.text(); 
      alert('User registered successfully!');
      console.log('Response from backend:', data);
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Failed to register user.');
    }

  };

  const fetchAllPlayers = async () => {
    try {
      const response = await fetch('https://localhost:7090/Player/all');
      const data = await response.json();
      setPlayers(data); 
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };

  const fetchAllWinners = async () => {
    try {
      const response = await fetch('https://localhost:7090/Player/winners');
      const data = await response.json();
      setPlayers(data); 
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };

  const fetchAllLose = async () => {
    try {
      const response = await fetch('https://localhost:7090/Player/losers');
      const data = await response.json();
      setPlayers(data); 
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };

  const handlePassSubmit = async (event) => {
    event.preventDefault();

    if (password !== '123456') {
      setError("Incorrect Password!");
      return;
    }
    setisPasswordSet(true);
    setError("");
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {!isPasswordSet ? (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <h1 className="text-4xl font-bold mb-6">Enter  Admin Password: </h1>
          <form
            onSubmit={handlePassSubmit}
            className="flex flex-col items-center"
          >
            {error && (
              <           p className="error">{error}</p>
            )}
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter here"
              className="mb-4 p-2 text-black rounded-lg bg-white text-center"
            />

            <button
              type="submit"
              className="px-6 py-3 bg-yellow-500 text-black rounded-xl shadow-lg text-lg font-bold hover:bg-yellow-400 transition-all duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        // admin screen.
        <>
          <div className='flex items-center justify-center Wcadmin' style={{ marginTop: 40, fontSize: 50, fontFamily: 'fantasy', color: '#F5C45E' }}>
            <p>WELCOME BACK ADMIN!</p>
          </div>

          <br />
          <div className="relative flex flex-col items-center">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ height: 600 }}>
                <div className="bg-[#E2DAD6] p-6 text-white rounded">
                  <p style={{ fontSize: 30, fontFamily: 'fantasy', color: 'black' }}>REGISTER NEW USER: </p>
                  <br />
                  <form onSubmit={handleRegister}>
                    <h1 className="text-4xl font-bold mb-6 label text-black"> Student Number:</h1>
                    <div style={{ position: 'flex', textAlign: 'center' }}>
                      {error && (
                        <           p className="error">{error}</p>
                      )}
                    </div>
                    <input
                      type="text"
                      value={studentNumber}
                      required
                      onChange={(e) => setStudentNumber(e.target.value)}
                      placeholder="Student Number"
                      className="mb-4 p-2 w-110 text-black rounded-lg bg-white text-center "
                      style={{ marginLeft: 55 }}
                    />

                    <h1 className="text-4xl font-bold mb-6 label text-black"> First Name:</h1>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="First Name"
                      className="mb-4 p-2 w-110 text-black rounded-lg bg-white text-center"
                      style={{ marginLeft: 55 }}
                    />

                    <h1 className="text-4xl font-bold mb-6 label text-black"> Last Name:</h1>
                    <input
                      type="text"
                      value={lastName}
                      required
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="mb-4 p-2 w-110 text-black rounded-lg bg-white text-center"
                      style={{ marginLeft: 55 }}
                    />
                    <div className="flex items-end justify-end">
                      <button className='flex items-end justify-end px-6 py-3 bg-yellow-500 text-black rounded-xl shadow-lg text-lg font-bold hover:bg-yellow-400 transition-all duration-300 user'> Register </button>
                    </div>

                  </form>
                </div>
                <div className="bg-[#7F8487] p-6 text-white rounded">
                  <div className="flex items-end justify-end">
                    <form>
                      <label style={{ fontSize: 20, letterSpacing: 5 }}> Filter: </label>
                      <select className='options' style={{ backgroundColor: 'white', color: 'black', padding: 10, borderRadius: 5, margin: 5 }}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "all") {
                            fetchAllPlayers();
                          }
                          if (value === "Win") {
                            fetchAllWinners();
                          }
                          if (value === "Lose") {
                            fetchAllLose();
                          }
                        }}>
                         <option value=""> </option> 
                        <option value="all">All Players</option>
                        <option value="Win">Winners</option>
                        <option value="Lose">Lose</option>
                      </select>
                    </form>
                  </div>
                  <br />
                  <div className="bg-[#D9D9D9] p-6 text-white rounded">
                    <div className="mt-4 overflow-y-scroll max-h-[500px] bg-white text-black p-4 rounded-lg">
                      {players.length > 0 ? (
                        <table className="w-full text-sm text-left border border-gray-300">
                          <thead className="bg-gray-300">
                            <tr>
                              <th className="px-4 py-2 border">Student #</th>
                              <th className="px-4 py-2 border">First Name</th>
                              <th className="px-4 py-2 border">Last Name</th>
                              <th className="px-4 py-2 border">Outcome</th>
                              <th className="px-4 py-2 border">Date Played</th>
                            </tr>
                          </thead>
                          <tbody>
                            {players.map((p, index) => (
                              <tr
                                key={p.studentNumber}
                                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                              >
                                <td className="px-4 py-2 border">{p.studentNumber}</td>
                                <td className="px-4 py-2 border">{p.firstName}</td>
                                <td className="px-4 py-2 border">{p.lastName}</td>
                                <td className="px-4 py-2 border">{p.outcome}</td>
                                <td className="px-4 py-2 border">
                                  {new Date(p.datePlayed).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>No players found.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </>
      )}





    </div>


  );
};

export default Admin;