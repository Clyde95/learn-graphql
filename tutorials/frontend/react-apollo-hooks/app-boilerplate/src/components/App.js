import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Header from "./Header";
import Login from "./Auth/Login";
import TodoPrivateWrapper from "./Todo/TodoPrivateWrapper";
import TodoPublicWrapper from "./Todo/TodoPublicWrapper";
import OnlineUsersWrapper from "./OnlineUsers/OnlineUsersWrapper";

import useAccessToken from "../hooks/useAccessToken";
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from "@apollo/client/link/ws";

const createApolloClient = (authToken) => {
  return new ApolloClient({
    link: new WebSocketLink({
      uri: 'wss://hasura.io/learn/graphql',
     options: {
       reconnect: true,
       connectionParams: {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }
  }
    }),
    cache: new InMemoryCache(),
  });
 };

const App = () => {
  const idToken = useAccessToken();
  const { loading, logout } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }
  const [client] = useState(createApolloClient(idToken));
   return (
    <ApolloProvider client={client}>
       <div>
       </div>
    </ApolloProvider>
     );
  

  if (!idToken) {
    return <Login />;
  }
  return (
    <div>
      <Header logoutHandler={logout} />
      <div className="row container-fluid p-left-right-0 m-left-right-0">
        <div className="row col-md-9 p-left-right-0 m-left-right-0">
          <div className="col-md-6 sliderMenu p-30">
            <TodoPrivateWrapper />
          </div>
          <div className="col-md-6 sliderMenu p-30 bg-gray border-right">
            <TodoPublicWrapper />
          </div>
        </div>
        <div className="col-md-3 p-left-right-0">
          <div className="col-md-12 sliderMenu p-30 bg-gray">
            <OnlineUsersWrapper />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
