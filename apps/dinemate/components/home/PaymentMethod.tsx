
"use client";

import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

// Define the type for the button labels array
const buttons: string[] = ['Not Now', '₱5.00', '₱10.00', '₱20.00', '₱40.00', '₱50.00', '₱100.00'];


const PaymentMethod = () => {

 // State to track the index of the active button
 const [activeButton, setActiveButton] = useState<number | null>(0);
 const [selectedCard, setSelectedCard] = useState<string | null>(null);
 const [selectedPwd, setselectedPwd] = useState<string | null>('Yes');
 const [showPaymentOptions, setShowPaymentOptions] = useState(false);

 // Function to handle button clicks
 const handleButtonClick = (index: number): void => {
   setActiveButton(index);
 };


const togglePaymentOptions = () => {
  setShowPaymentOptions(!showPaymentOptions);
};


const handleCardClick = (card: string) => {
  setSelectedCard(card);
};


const handlePwdClick = (card: string) => {
  setselectedPwd(card);
};



  return (
    <div className="flex flex-col p-4 bg-white mb-[3.5em] mt-[1.5em]">
      {/* Cash Payment */}
      <Link  
      href={{
        pathname: "/cart/confirmation",
        query: {
          mode: "cash"
        }
      }}
      replace
      className="flex items-center justify-between w-full p-4 bg-white rounded-lg cursor-pointer transform active:scale-95 transition-transform duration-200"
      >
        <span className="flex items-center gap-[0.25em] ">
          <Image src="/cash-icon.svg" alt="Cash Icon" className="w-6" width={6} height={6} />
         
          <p className='pt-[0.5em] text-[1rem] font-[31.25em] pl-[0.25em]'> Cash Payment</p>
        </span>
        <button>
          <Image src="/arrow-right.icon.svg" alt="Arrow Icon" className="w-4 h-4" width={4} height={4}/>
        </button>
      </Link>

      <Link  
      href={{
        pathname: "/app/cart/confirmation",
        query: {
          mode: "paypal"
        }
      }}
      replace
      className="flex items-center justify-between w-full p-4 bg-white rounded-lg cursor-pointer transform active:scale-95 transition-transform duration-200"
      >
        <span className="flex items-center gap-[0.25em] ">
          <Image src="/cash-icon.svg" alt="Cash Icon" className="w-6" width={6} height={6} />
         
          <p className='pt-[0.5em] text-[1rem] font-[31.25em] pl-[0.25em]'> Paypal</p>
        </span>
        <button>
          <Image src="/arrow-right.icon.svg" alt="Arrow Icon" className="w-4 h-4" width={4} height={4}/>
        </button>
      </Link>
      <p className='text-red-600 font-semibold py-4'>Cash and Paypal Payment is currenly available for now.</p>
      {/* Credit/Debit Card */}
      <div className="flex flex-col p-[1.25em] mt-4 bg-white ml-[0.5em] mr-[0.5em]">
        
        
        <div className="flex items-center justify-between cursor-pointer transform active:scale-95 transition-transform duration-200"
          onClick={togglePaymentOptions}
        >
          
          
          <span className="flex items-center">
            <Image  src="/credit-debit.svg" alt="Credit Card Icon" className="w-6 h-6 mr-2 text-center" width={6} height={6} />
            Credit/Debit Card
          </span>
          <button>
            {/* <img src="/debit-card-up.svg" alt="Arrow Icon" className="w-4 h-4 cursor-pointer transform active:scale-95 transition-transform" /> */}
          
            <Image
            src={showPaymentOptions ? "/debit-card-down.svg" : "/debit-card-up.svg"}
            alt="Arrow Icon"
            className="w-4 h-4 cursor-pointer transform active:scale-95 transition-transform"
            width={4} height={4}
          />

          </button>
        </div>






       {/* Conditional rendering of payment options with transition */}
       <div
        className={`${
          showPaymentOptions ? 'max-h-[500px]' : 'max-h-0 opacity-0'
        } overflow-hidden transition-all duration-1000 ease-in-out `}
      >

         <Image src="/horizontal-icon.svg" alt="Horizontal line Icon" width={304} height={2} className='w-full mt-[1.25em] mb-[1.25em]'/>
        
        <div className="flex flex-col mt-4 space-y-2">
          

          <button
            className="flex items-center justify-between py-[1em] px-[0.5em] border border-[2px] border-[#30353C80] rounded-lg transform active:scale-95 transition-transform duration-200 ease-in-out"
            onClick={() => handleCardClick('mastercard')}
          >
            <Image src="/mastercard-icon.svg" alt="Mastercard Icon" className="w-45" width={32} height={24} />
            <Image
              src={selectedCard === 'mastercard' ? "/payment-circle-fill.svg" : "/payment-circle-empty.svg"}
              alt="Payment Circle Icon"
              className="w-4 h-4"
              width={32} height={24}
            />
          </button>

          <button
            className="flex items-center justify-between py-[1em] px-[0.5em] border border-[2px] border-[#30353C80] rounded-lg transform active:scale-95 transition-transform duration-200 ease-in-out"
            onClick={() => handleCardClick('visa')}
          >
            <Image src="/visa-icon.svg" alt="Visa Icon" className="w-45" width={32} height={22}/>
            <Image
              src={selectedCard === 'visa' ? "/payment-circle-fill.svg" : "/payment-circle-empty.svg"}
              alt="Payment Circle Icon"
              className="w-4 h-4"
              width={32} height={24}
            />
          </button>

          <button
            className="flex items-center justify-between py-[1em] px-[0.5em] border border-[2px] border-[#30353C80] rounded-lg transform active:scale-95 transition-transform duration-200 ease-in-out"
            onClick={() => handleCardClick('gcash')}
          >
             <Image src="/gcash-icon.svg" alt="GCash Icon" className="w-45"  width={52} height={20}/>
            <Image
              src={selectedCard === 'gcash' ? "/payment-circle-fill.svg" : "/payment-circle-empty.svg"}
              alt="Payment Circle Icon"
              className="w-4 h-4"
              width={32} height={24}
            />
          </button>
        </div>
      </div>


      </div>

      {/* PWD/Senior Card */}
      <div className="flex flex-col p-4 mt-4 ml-[0.5em] mr-[0.5em]"
      >

        <div className="flex items-center justify-center"
         
        >
          <Image src="/chair-icon.svg" alt="PWD Icon" className="w-6"  width={24} height={24}/>
          
          <p className='text-[#645656] pl-[0.1875em] font-[31.25em] whitespace-nowrap'>Do you have PWD / Senior Card? </p>
        </div>



        <div className="flex flex-col mt-4">

          <div className=' px-[1.5em]'>


          <button className="flex items-center justify-between p-2  cursor-pointer transform active:scale-95 transition-transform duration-200 w-full"
          onClick={() => handlePwdClick('Yes')}
          >

<p className={`text-center ${selectedPwd === 'Yes' ? 'text-orange-500' : 'text-black'}`}>
          Yes, I have.
        </p>
            <Image
              src={selectedPwd === 'Yes' ? "/payment-circle-fill.svg" : "/payment-circle-empty.svg"}
              alt="Payment Circle Icon"
              className="w-4 h-4"
              width={32} height={24}
            />

          </button>
          <button className="flex items-center justify-between p-2  cursor-pointer transform active:scale-95 transition-transform duration-200 w-full mt-[0.5em]"
          onClick={() => handlePwdClick('No')}
          >
          <p className={`text-center ${selectedPwd === 'No' ? 'text-orange-500' : 'text-black'}`}>
         No, I have.
        </p>
            <Image
              src={selectedPwd === 'No' ? "/payment-circle-fill.svg" : "/payment-circle-empty.svg"}
              alt="Payment Circle Icon"
              className="w-4 h-4"
              width={32} height={24}
            />
          </button>
            
          </div>


         

          </div>



        </div>



        

      {/* Give Tip */}
      <div className="flex flex-col w-full p-4 mt-4 ">
        <div className="flex justify-center">
        <Image src="/coin-icon.svg" alt="Tip Icon" className="w-6 mr-2 text-[#645656]"  width={24} height={24}/>
         
          Give Tip
          
        </div>


<div className='flex flex-col mt-[0.5625em]'>

<div className='flex items-center justify-center'>

<p className='text-center'>100% of the tip go to our service crews</p>

</div>

<div className="flex items-center justify-center flex-wrap mt-4 gap-[0.4em]">
  {buttons.map((label, index) => {
        // Determine class names based on active state
        const classNames = `
          p-2 border rounded-[1.5em]
          pt-[0.4375em] pb-[0.4375em] 
          cursor-pointer transform active:scale-95 transition-transform duration-200
          ${activeButton === index ? 'bg-[#FF6C62] text-white' : 'text-[#656160]'}
        `;

        return (
          <button
            key={index}
            className={classNames}
            onClick={() => handleButtonClick(index)}
          >
            {label}
          </button>
        );
      })}
</div>

</div>
       


      </div>

      {/* Total and Proceed to Pay */}
      <div className="flex flex-col w-full p-4 mt-4 border-t border-[#030101]">
        <div className="flex items-center justify-between">
          <span className='font-bold'>TOTAL</span>
          <span className='font-bold'>₱370.00</span>
        </div>
        <button className="w-full p-4 mt-4 text-white bg-orange-500 rounded-lg cursor-pointer transform active:scale-95 transition-transform duration-200 font-bold">
          Proceed to Pay
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;