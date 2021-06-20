import React from 'react';

const Rank =({name, entries}) =>{
    return (
        <div>
            <div className = 'red f3'>
                {`${name}, your current rank is`}
            </div>
            <div className = 'red f2'>
                {entries}
            </div>
        </div>
    )
}

export default Rank;