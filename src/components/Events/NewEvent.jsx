import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../util/http.js';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { createNewEvent} from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

  const {mutate ,isPending, isError, error} = useMutation({
    mutationFn: createNewEvent,
    onSuccess:()=> {
      queryClient.invalidateQueries({ queryKey: ['events'] }); //ur data fresh by ensuring that the cached data is updated , updated with the latest data from the server; Automatic Refetching: 
      navigate('/events')
    }
  })

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submitting...'}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            'Failed to create event. Please check your inputs and try again later.'
          }

          
        />
      )}
    </Modal>
  );
}