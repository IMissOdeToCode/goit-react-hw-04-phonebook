import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Notiflix from 'notiflix';

import ContactsList from '../ContactsList/ContactsList';
import ContactsFilter from '../ContactsFilter/ContactsFilter';
import ContactsForm from '../ContactsForm/ContactsForm';

import defaultContacts from '../utils/contacts';

import css from './PhoneBook.module.scss';

const PhoneBook = () => {
  const [contacts, setContacts] = useState(() => {
    const contacts = JSON.parse(window.localStorage.getItem('my-contacts'));
    return contacts ? contacts : [...defaultContacts];
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const write = JSON.stringify(contacts);
    window.localStorage.setItem('my-contacts', write);
  }, [contacts]);

  const isDublicate = name => {
    const normalizedName = name.toLowerCase();
    const q = contacts.find(({ name }) => {
      return name.toLowerCase() === normalizedName;
    });

    return Boolean(q);
  };

  const addContact = ({ name, number }) => {
    if (isDublicate(name)) {
      Notiflix.Notify.failure('name already exists');
      return false;
    }

    setContacts(prevContacts => {
      const newContact = {
        id: nanoid(),
        name,
        number,
      };
      return [...prevContacts, newContact];
    });

    return true;
  };

  const removeContact = id => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== id)
    );
  };

  const handleFilter = ({ target }) => setFilter(target.value);

  const getFilteredContacts = () => {
    if (!filter) {
      return contacts;
    }

    const normalizedFilter = filter.toLowerCase();
    const result = contacts.filter(({ name }) => {
      return name.toLowerCase().includes(normalizedFilter);
    });
    return result;
  };

  const filteredContacts = getFilteredContacts();
  const isContacts = Boolean(filteredContacts.length);

  return (
    <div className={css.wrapper}>
      <div className={css.block}>
        <h1 className={css.header}>Phonebook</h1>
        <ContactsForm onSubmit={addContact} />
      </div>

      <div className={css.block}>
        <h2 className={css.header}>Contacts</h2>
        <ContactsFilter handleChange={handleFilter} />

        {isContacts && (
          <ContactsList
            contacts={filteredContacts}
            removeContact={removeContact}
          />
        )}
        {!isContacts && <p className={css.header}>No contacts in list</p>}
      </div>
    </div>
  );
};

export default PhoneBook;
