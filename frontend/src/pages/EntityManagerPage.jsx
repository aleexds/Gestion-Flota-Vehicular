import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AlertNotification from '../components/AlertNotification';
import GenericCrudView from '../components/GenericCrudView';
import { ENTITIES } from '../config/entitiesConfig';

export default function EntityManagerPage() {
  const { entityKey } = useParams();
  const [alert, setAlert] = useState(null);

  const entityConfig = ENTITIES[entityKey];

  if (!entityConfig) {
    return <Navigate to="/" replace />;
  }

  const handleNotify = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-wrapper">
        <Topbar title={`FleetOps - ${entityConfig.plural}`} />

        <main className="content-area">
          <AlertNotification alert={alert} onClose={() => setAlert(null)} />
          <GenericCrudView 
            key={entityConfig.key} 
            entityConfig={entityConfig} 
            onNotify={handleNotify} 
          />
        </main>
      </div>
    </div>
  );
}

