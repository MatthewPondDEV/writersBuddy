import { createContext } from "react";
import { useState } from 'react';

export const ProjectContext = createContext({})

export function ProjectContextProvider({children}) {
    const [projectInfo,setProjectInfo] = useState({})
    return (
        <ProjectContext.Provider value={{projectInfo,setProjectInfo}}>
            {children}
        </ProjectContext.Provider>
    )
}