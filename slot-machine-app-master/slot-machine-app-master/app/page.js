'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaGem, FaHeart, FaLaptopCode, FaQuestion } from 'react-icons/fa';
import Link from 'next/link';

const spinningMessages = [
  "Spinning... This could be your lucky compile!",
  "Spinning... Will your code execute correctly?",
  "Spinning... Debugging your luck!",
  "Spinning... Optimizing for a win!",
  "Spinning... Crossing fingers for no infinite loop!",
  "Spinning... Are you a computer science genius?",
  "Spinning... Hope you don't hit a bug!",
  "Spinning... Will you make it past the first condition?",
  "Spinning... 3, 2, 1... Success?",
  "Spinning... Can you break the recursion?"
];

const gameOverMessages = [
  "Oops! Looks like your code threw an error. Game Over!",
  "Your algorithm failed... Better luck next time!",
  "Looks like you hit a segmentation fault. Game Over!",
  "Compile error! Try again!",
  "This is the equivalent of a 404... Game Over!",
  "You’ve been debugged... by failure.",
  "Oops! Infinite loop... in the wrong direction. Game Over!",
  "Game Over, but at least you didn't get caught in an endless recursion.",
  "404: Success Not Found. Try again!",
  "Better luck next time, your code ran out of retries!"
];


// Define symbols, including a computer science–themed symbol.
const symbols = [
  { icon: <FaStar className="text-yellow-400" />, name: 'Star' },
  { icon: <FaGem className="text-blue-400" />, name: 'Gem' },
  { icon: <FaHeart className="text-red-400" />, name: 'Heart' },
  { icon: <FaLaptopCode className="text-green-400" />, name: 'Code' },
  { icon: <FaQuestion className="text-red-400" />, name: 'Question' },
];

// Utility to get a random symbol.
const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

// ----- Confetti Component -----
// Renders animated confetti using Framer Motion.
const Confetti = () => {
  const pieces = new Array(30).fill(0);
  const colors = ["#FFC700", "#FF0000", "#2E3192", "#41BBC7"];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((_, index) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 2;
        const size = 5 + Math.random() * 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={index}
            className="absolute rounded-full"
            initial={{ opacity: 0, y: -20, rotate: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, window.innerHeight * 1.2],
              rotate: [0, 360]
            }}
            transition={{ duration, delay, ease: "easeInOut" }}
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
};

const Home = () => {
 
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <h1 className='Welcome'>WELCOME TO SLOT MACHINE!</h1>
      <div className='col-sm12 col-md-2'>
      <Link href="/admin">
        <button className='px-6 py-3 bg-yellow-500 text-black rounded-xl shadow-lg text-lg font-bold hover:bg-yellow-400 transition-all duration-300 user'> Admin</button>
        </Link>
      <Link href="/player">
        <button className='px-6 py-3 bg-yellow-500 text-black rounded-xl shadow-lg text-lg font-bold hover:bg-yellow-400 transition-all duration-300 user'> Player</button>
        </Link>
      </div>
     </div>
  );
};

export default Home;