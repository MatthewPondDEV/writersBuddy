import './App.css';
import {Route, Routes} from 'react-router-dom'
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectPage';
import NotePage from './pages/NotePage';
import ManagePojects from './pages/ManageProjects';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/project/:id' element={<ProjectsPage />  } />
        <Route path='/notes' element={<NotePage />} />
        <Route path='/manageProjects' element={<ManagePojects />} />
      </Route>
    </Routes>
  )
}

export default App
