import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { H1 } from './ui/H1';
import { UpsertModal } from './UpsertModal';
import { Transactions } from './Transactions';
import { DeleteModal } from './DeleteModal';



export const  Incomes =()=>{
const [showAll, setShowAll] = useState(true);
const [rating, setRating] = useState(0);
const [text, setText] = useState('');
    const [isOpen, setIsOpen] = useState({
        // upsert is upsert or edit
        upsert: false,
        delete: false,
        item: null,
        action: ''
    });

    const [Incomes, setIncomes] = useState([]);
    let [curMonth, setCurMonth] = useState(0);
    
    const onSubmit = (data) => {
      if(isOpen.action === "EDIT"){
        const newIncomes = Incomes.map((Income) => {
            if(Income.id === isOpen.item.id){
                return {
                    ...Income,
                    ...data,
                    rating
                }
            }
            return Income
        })
        localStorage.setItem('Incomes', JSON.stringify(newIncomes))
      } else {
        const newIncome = {
            id: uuidv4(),
            ...data,
            rating,
        }

        localStorage.setItem('Incomes', JSON.stringify([...Incomes, newIncome]))
      }
      setIsOpen(false)
      setRating(0)
    }

    const months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];

   
    const deleteIncome = (id) => {
        const newIncomes = Incomes.filter((Income) => Income.id !== id)
        localStorage.setItem('Incomes', JSON.stringify(newIncomes))
        setIsOpen({...isOpen, delete: false, id: null})
    }

    const results = Incomes?.filter(Income => { 
        const IncomesDate = new Date(Income.date);
        return(
        (Income.title?.toLowerCase().includes(text?.toLowerCase()) && ( showAll || IncomesDate.getMonth() === curMonth))
        );
    });

    const editIncome = (id) => {
        const Income = Incomes.find((Income) => Income.id === id)
        setIsOpen({...isOpen, upsert: true, Income: Income})
    }


     useEffect(() => {
        if(!isOpen){
            setRating(0)
        }
      const Incomes = JSON.parse(localStorage.getItem('Incomes'));
      if(Incomes){
        setIncomes(Incomes)
      }
      else{
        setIncomes([])
      }
    }, [isOpen])

    const sum = results?.reduce((acc, Income) => acc + +Income.amount, 0) || 0
    return(
        <div><div className='flex flex-col justify-center p-6 text-center'>
        <H1 className={'text-slate-500'}>Incomes</H1>
        <h2 className='pt-5 text-2xl text-slate-500'>Total Incomes:{sum} </h2>
        <input
            className='w-10/12 p-2 m-2 mx-auto mt-8 text-gray-700 bg-gray-200 sm:w-72 rounded-xl'
            type="text"
            placeholder="Search Incomes..."
            onChange={({target}) => setText(target.value)}
        />
        <div className='flex justify-center p-6 text-center'>
            <FontAwesomeIcon 
                className='text-3xl text-white' icon = {faArrowLeft} 
                onClick = {() => {
                    if(curMonth > 0) 
                        setCurMonth(--curMonth)
                }}
            />
            <h2 
                className='pl-3 pr-3 text-xl text-white'>{months[curMonth]}
            </h2>
            <FontAwesomeIcon
                className='text-3xl text-white' icon = {faArrowRight} 
                onClick = {() => {
                    if(curMonth < 11)
                        setCurMonth(++curMonth)
                }}
            />
            <button className='flex items-center justify-center pl-7 pr-7 
            px-4 py-0.5 text-xl text-center text-white rounded-lg ml-7
             bg-slate-700'
                onClick={() => setShowAll(!showAll)}
            >
                {showAll ? 'Filter Months' : 'Clear Filters'}
            </button>
        </div>
    </div>
    <div className='flex max-sm:justify-center'>
        <button className='w-8/12 p-2 mt-8 text-white border sm:w-72 lg:ml-5 bg-black/40 rounded-xl' onClick = {() => setIsOpen({...isOpen, upsert: true})}>Add Income</button>
    </div>
    
    {results.length?(
                <div className="grid gap-5 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">               
               <Transactions
                items={results}
                setIsOpen={setIsOpen}
                isOpen={isOpen}/>
            </div>
            ): (
                <div className='flex justify-center p-6 text-center'>
                    <h2 className='text-2xl text-slate-500'>No Expenses Found...</h2>
                </div>
            )}
   
     {isOpen.upsert ? (
        <UpsertModal
        setIsOpen = {setIsOpen} 
        isOpen = {isOpen} 
        title = {isOpen.action === "EDIT" ? 'Edit Income' : 'Add Income'} 
        onSubmit = {onSubmit}
        rating = {rating}
        setRating = {setRating}
        />
    ) : null}

{isOpen.delete ? (
                <DeleteModal
                    setIsOpen={setIsOpen}
                    isOpen={isOpen.delete}
                    title = 'Delete Income'
                    deleteItem = {() => deleteIncome(isOpen.item.id)}
                />

            ):null}
     </div>
    
    )
}