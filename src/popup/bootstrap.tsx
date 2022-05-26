import { createContext, ReactNode, useContext, useEffect } from 'react';
import {
  FigmaFileManager,
  FigmaOptionsStore,
  GitHubOptionsStore,
  InspectorOptionsStore,
} from './stores';

export interface Services {
  figmaFileManager: FigmaFileManager;
  figmaOptions: FigmaOptionsStore;
  githubOptions: GitHubOptionsStore;
  inspectorOptions: InspectorOptionsStore;
}

const ServicesContext = createContext<Services>(null as any as Services);

export const Bootstrap =
  ({
     children,
     services,
     onBootstrap,
   }: { children: ReactNode, services: Services, onBootstrap: () => () => void }) => {
    useEffect(() => {
      return onBootstrap();
    }, []);
    return <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>;
  };

export const useService = <T extends keyof Services, >(name: T): Services[T] => {
  const services = useContext(ServicesContext);
  return services[name];
};
