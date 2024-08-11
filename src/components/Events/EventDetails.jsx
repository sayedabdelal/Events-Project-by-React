
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import { fetchEvent } from '../../util/http.js';

import { useQuery, useMutation } from '@tanstack/react-query';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx'; 
import { queryClient, deleteEvent } from '../../util/http.js';

import Header from '../Header.jsx';
import Modal from '../UI/Modal.jsx';
import { useState } from 'react';


export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  const id = useParams().id;
  const navigate = useNavigate();

  const { data, isLoading, isPending, isError, error } = useQuery({
    queryKey: ['event', { id }],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  })

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error: deleteError,

  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none'
      });
      navigate('/events');
    }
  })


  let content = <p>Please enter a search term and to find events.</p>;
  if (isPending) {
    return <div  id="event-details-" className='center'>Loading Fetch Data...</div>;
  }

  // if (isLoading) {
  //   content = <LoadingIndicator />;
  // }
 

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || 'Failed to fetch events.'}
      />
    );
  }
  if(data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  
    content = (
      <>
         <header>
          <h1>{data.title}</h1>
          
          <nav>
            <button onClick={ handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formattedDate} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    )    
  }

  function handleDelet() {
    mutate({ id: id });
    setIsDeleting(true)
    
  }
  function handleStartDelete() {
    setIsDeleting(true);
  }
  function handleStopDelet() {
    setIsDeleting(false)
  }
    
 



  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDelet}>
        <h2>Are you sure you want to delete this event?</h2>
        <div className='form-action'>
          {isPendingDeletion && <p>Deleting Please Wait...</p>}
          {!isPendingDeletion && ( 
            <>
               <button onClick={handleDelet} className='button'>Delet</button>
               <button onClick={handleStopDelet} className='button-text'>Cancel</button>
            </>
          )}
         
        </div>
        {isErrorDeleting && <ErrorBlock title="Failed to delete event" message={deleteError.info?.message || 'An error occurred while deleting the event.'} />}
        
      </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
         
       
      </article>
    </>
  );
}

/*
isLoading:: true when the query is fetching data for the first time -- show a loading spinner or initial loading state 

isPending::  process of fetching, which includes both initial loads and refetches.

 queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none'
      });
      , ensuring that the next time it is accessed, it will refetch.

    cache invalidation is the process of removing the cached data from the queryClient.
    cache management 

   refetchType: 'none' // to prevent the query from refetching after the mutation is successful.

*/