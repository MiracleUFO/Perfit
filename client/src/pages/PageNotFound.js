import { NavLink } from 'react-router-dom';
import Error from '../components/Error';

const PageNotFound = () => (
    <main>
         <Error msg='Page not found.'>
            <NavLink to='/'>Go to Home</NavLink>
        </Error>
    </main>
);

export default PageNotFound;