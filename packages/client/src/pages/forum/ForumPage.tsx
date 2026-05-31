import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { usePage } from '../../hooks/usePage';
import s from './Forum.module.css';
import { useMemo } from 'react';
import { PROFILE_FIELDS } from '../../constants/profile/constants';
import { useProfile } from './useProfile';

export const ForumPage = () => {
  usePage({ initPage: initForumPage });

  const { user, avatarUrl, handleAvatarChange, handleAvatarSubmit } = useProfile();

  const profileFields = useMemo(() => {
    if (!user) {
      return null;
    }

    const fields = (Object.entries(PROFILE_FIELDS) as [keyof typeof PROFILE_FIELDS, string][]).map(
      ([key, label]) => (
        <li key={key} className={s.profileItem}>
          <div className={s.profileLabel}>{label}</div>
          <div className={s.profileText}>{user[key]}</div>
        </li>
      )
    );

    return fields;
  }, [user]);

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Форум" />
      </Helmet>
      <Header />

      <pre>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet asperiores at autem cum
        dignissimos itaque laudantium molestiae molestias nisi obcaecati officiis pariatur
        quibusdam, repellendus sapiente similique tenetur vitae! Ab ad alias consequuntur cumque
        dolore ea error eveniet fugit iure minus nostrum obcaecati possimus provident quae quas,
        quibusdam quod, repudiandae sapiente similique ut. Consequatur dolor id quam repellat? Aut
        doloremque doloribus eos ex ipsa iste iure minima molestiae odio porro, quam sapiente
        veritatis. Asperiores autem blanditiis consectetur deserunt dolorem doloribus dolorum esse
        est eveniet exercitationem expedita inventore ipsa iste itaque labore libero modi nostrum
        officia provident quibusdam, quisquam quos ratione repellendus sequi sunt tempora velit?
        Beatae eos error explicabo in ipsa maiores necessitatibus nostrum omnis tenetur voluptate.
        Animi cum dolorem doloribus excepturi illo, in maiores molestiae non quasi rem sed totam?
        Assumenda consectetur, cumque dolor error expedita harum, maxime, molestias necessitatibus
        numquam perspiciatis praesentium quos rem repellendus sit tempora tempore temporibus?
        Accusamus alias autem corporis dicta dolore dolores eos ex fuga hic illum magnam nemo nulla
        numquam perspiciatis, porro provident quas qui quisquam recusandae rerum! A adipisci
        consequatur culpa, cum debitis ea, eaque eius enim est modi nihil nostrum, nulla numquam
        odio placeat possimus quaerat quisquam quos rerum similique totam veniam voluptas! Aliquam,
        earum enim facere maxime nobis perferendis quidem quisquam recusandae? Asperiores at atque
        consequatur cupiditate delectus deserunt earum esse eum ex fugit harum incidunt ipsa
        laudantium magnam natus nisi nobis obcaecati provident quaerat ratione recusandae reiciendis
        sapiente, sequi sint ut voluptas voluptatem! Amet eligendi, excepturi laboriosam laborum
        officiis pariatur. Impedit iste iure natus porro, recusandae reiciendis repellat velit?
        Aperiam deserunt doloremque, eaque itaque nesciunt perferendis vero! Ad beatae corporis
        distinctio doloribus ducimus ea eaque eius enim et facilis fugit hic id incidunt iusto,
        labore magnam modi numquam odio officiis praesentium quia quibusdam quisquam quos recusandae
        rem sint soluta sunt totam vel voluptas. Accusantium adipisci aliquid aperiam atque cumque
        debitis deserunt dignissimos dolore dolorum ducimus est eum eveniet excepturi explicabo
        facilis, harum impedit itaque iusto laborum magnam, minus nemo nihil odit pariatur quae quam
        quidem quo repellat sed totam vel velit veritatis vitae. Ad beatae consectetur debitis dolor
        esse est fuga fugiat fugit id incidunt, ipsa, iusto laudantium magni minima necessitatibus
        nemo neque odio officiis omnis perferendis quidem quod quos ratione repellendus repudiandae
        rerum sapiente sed tempora tempore temporibus totam unde, velit vitae? Ea incidunt minima,
        non placeat porro quis tempore. Consequatur debitis expedita, perferendis perspiciatis
        possimus quidem voluptas! Cupiditate incidunt provident rem! Consectetur consequatur
        corporis cum cupiditate fuga illo, ipsum iste laborum magni maxime odio perferendis possimus
        ratione, rem rerum sit voluptatum? A ad adipisci aliquid aspernatur, consequuntur culpa
        cumque cupiditate debitis deserunt dicta distinctio dolorem eligendi excepturi
        exercitationem fuga id iure laboriosam laborum officiis quod quos ratione suscipit tempora
        unde voluptatibus? Distinctio dolorem inventore magni maxime quaerat! Autem beatae doloribus
        iusto non officia sed? Corporis ducimus eius, illo illum necessitatibus nemo neque nisi
        quibusdam. Ad alias, assumenda at, consequatur cumque deserunt dignissimos dolorum ducimus
        esse ex explicabo fugiat hic illo in inventore ipsam iste, laudantium mollitia omnis placeat
        praesentium quam qui quo quos rem repellat repellendus saepe sapiente sequi sint tempore vel
        velit veniam? Ab accusantium aliquam assumenda dolorem eaque error esse eveniet ex expedita
        fuga, fugit in inventore iste iusto libero minus modi nam natus nemo non quae quam quasi qui
        quia repellat repellendus reprehenderit sequi temporibus tenetur voluptates? Iste libero
        magni quos repellendus vitae. Autem ducimus earum est ex excepturi illum, impedit in, modi
        nesciunt nostrum obcaecati odit officiis provident quaerat, quod ratione reiciendis unde?
        Adipisci aliquid amet aut beatae blanditiis consequatur culpa debitis dolorum eius eligendi
        error eum, id iste iure maiores modi necessitatibus neque nobis numquam officiis omnis
        pariatur quae quaerat qui ratione recusandae rem, saepe similique soluta tempora tenetur,
        totam velit vitae? Doloremque dolorum fuga iure, magnam minus nobis porro velit. Ex,
        laboriosam, tenetur! Amet dolore, error facere facilis illum, inventore ipsa, iusto labore
        pariatur possimus praesentium quis sequi tempora. Aperiam consequuntur modi, officia omnis
        praesentium quae reiciendis repellat. Beatae dolor natus odio quo saepe soluta voluptatem. A
        beatae, dolore dolores eius eos error esse et facilis hic illum inventore ipsum itaque
        labore laborum laudantium maxime molestiae mollitia, numquam officia perferendis porro quasi
        quod rem! Asperiores facilis ipsa perferendis placeat voluptates. Dicta neque nesciunt odit
        quo quos suscipit temporibus voluptates. Beatae deleniti dignissimos dolore eaque fugit,
        illum, iste labore laboriosam magni minima nam necessitatibus nobis non nostrum pariatur qui
        quibusdam quis repellendus repudiandae sed sit sunt totam. Alias deleniti dolor excepturi,
        modi nisi placeat quam sequi vero! Ab asperiores at aut ea eveniet perferendis quas
        quibusdam quo quod! At eligendi in laborum sit velit. Aliquam amet architecto beatae debitis
        facilis illum itaque iusto labore laudantium molestiae nemo nesciunt pariatur placeat, quae
        quia quod reiciendis reprehenderit rerum soluta ut? Ab asperiores non repellendus sequi sunt
        temporibus. Ad adipisci animi asperiores culpa debitis dignissimos dolorum error ex fugit
        labore nam nemo neque officia quasi, reprehenderit sapiente sit tenetur totam veniam,
        voluptatem? Dignissimos impedit ipsum mollitia neque obcaecati provident quo tempore
        voluptatem voluptates. Ab accusamus aliquid amet asperiores assumenda atque beatae cum
        cumque cupiditate dicta dolore dolorum enim error illum ipsum magnam magni, maiores modi
        molestiae neque nesciunt nobis odio omnis optio placeat praesentium, quas, quidem
        repudiandae sint sunt suscipit tempore totam velit veniam voluptas voluptates voluptatibus!
        Accusamus cumque delectus dolores dolorum eos est illum in ipsa laboriosam laudantium magnam
        nemo, non nostrum quidem quis sequi vero voluptates voluptatibus? Amet aperiam architecto at
        doloremque iste. Ab accusantium, aliquam aliquid architecto atque beatae consectetur
        consequatur corporis cum deserunt distinctio dolor dolorem doloremque earum eos eum eveniet
        ex excepturi explicabo incidunt inventore ipsum iste laboriosam libero magnam magni maxime
        molestias, odit pariatur perspiciatis possimus quisquam quos repudiandae sequi tempore
        voluptates voluptatum. Accusamus adipisci animi autem cupiditate error facilis fuga impedit
        nulla. A accusantium adipisci aliquam aperiam asperiores autem consequatur distinctio
        dolorum eligendi exercitationem expedita harum ipsum iusto, magni nam nemo neque nisi odit,
        optio quam quia quis repellendus, sint ullam unde vitae voluptatum. Beatae id laboriosam
        laudantium, quos saepe sit ullam. Ad ducimus magni odit quasi repellat unde.
      </pre>
    </div>
  );
};

export const initForumPage = () => Promise.resolve();
