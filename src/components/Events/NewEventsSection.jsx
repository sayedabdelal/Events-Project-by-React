import { useQuery } from '@tanstack/react-query';

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from '../../util/http.js';

export default function NewEventsSection() {
  const { data, isPending, isError, error } = useQuery({ // useState + useEffect
    queryKey: ['events', {max: 3}], //  used for caching and refetching control , unique identifer
    queryFn: ({signal, queryKey})=> fetchEvents({signal, ...queryKey[1]}),  //Function to fetch data, can be async and typically returns a promise
    staleTime: 0, //  50000 Function to fetch data, can be async and typically returns a promise
    gcTime:50000 // long time have to stoe data in cashing
  });

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || 'Failed to fetch events.'}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}

/*
staleTime determines how long data is considered fresh and not refetched.
cacheTime (gcTime) determines how long data stays in memory after becoming unuse
*/