import { Helmet } from 'react-helmet-async';
import { useSelector } from '../store';
import { Header } from '../components/Header';
import { fetchFriendsThunk, selectFriends, selectIsLoadingFriends } from '../slices/friendsSlice';
import { selectUser } from '../slices/userSlice';
import { PageInitArgs } from '../routes';
import { usePage } from '../hooks/usePage';

export const FriendsPage = () => {
  const friends = useSelector(selectFriends);
  const isLoading = useSelector(selectIsLoadingFriends);
  const user = useSelector(selectUser);

  usePage({ initPage: initFriendsPage });

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Список друзей</title>
        <meta
          name="description"
          content="Страница со списком друзей и с информацией о пользователе"
        />
      </Helmet>
      <Header />
      {user ? (
        <>
          <h3>Информация о пользователе:</h3>{' '}
          <p>
            {user.name} {user.secondName}
          </p>
        </>
      ) : (
        <h3>Пользователь не найден</h3>
      )}
      {isLoading ? (
        'Загрузка списка...'
      ) : (
        <ul>
          {friends.map((friend) => (
            <li key={friend.name}>
              {friend.name} {friend.secondName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Друзья — публичные данные с нашего сервера, их можно префетчить на сервере
// Пользователь грузится в ProtectedRoute (клиентская кука), здесь его не тянем (нужно делать нормальое проксирование,
// или жадть, пока Яндекс выполнит заявку, и сделает куку паршл =/
export const initFriendsPage = ({ dispatch }: PageInitArgs) => {
  return dispatch(fetchFriendsThunk());
};
