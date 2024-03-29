import { useEffect, useState } from 'react';
import { sendMessage } from 'services/User/userService';
import { toast } from 'react-toastify';

const FloatingContactForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!showForm) {
      resetState();
    }
  }, [showForm]);

  const resetState = () => {
    setIsSubmitted(false);
    setMessage('');
    setEmail('');
    setName('');
    setTitle('');
  };

  const handleSend = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if ((email, message)) {
      let payload = {
        type: 'user_contact',
        email,
        message,
        name,
        title,
      };
      sendMessage(payload)
        .then((resp) => {
          if (resp?.code === 0) {
            toast.success(
              `Thank you for the message, we will contact you as soon as possible.`
            );
          } else {
            toast.error(`Failed to send the message. Please try again!`);
          }
          resetState();
          setShowForm(false);
        })
        .catch((err) => {
          resetState();
          toast.error(`Failed to send the message. Please try again!`);
        });
    }
  };

  let validEmail = isSubmitted && !email;
  let validMessage = isSubmitted && !message;
  let validName = isSubmitted && !name;
  let validTitle = isSubmitted && !title;
  return (
    <>
      {showForm ? (
        <div className='w-[350px] contact-help-form fixed right-5 bottom-[8%] transition duration-150 ease-in-out rounded-[20px] z-[10]'>
          <div className='contact-help-header bg-[#59cdff] p-5'>
            <h2 className='mb-2'>Hello! 👋</h2>
            <p>Need Help? Please write to us!</p>
          </div>
          <form onSubmit={handleSend}>
            <div className='p-6'>
              <div className='mb-6'>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='p-4 mb-1'
                  name='message'
                  type='email'
                  placeholder='Email'
                />
                {validEmail && (
                  <p className='text-red-400 text-sm'>Email is required</p>
                )}
              </div>
              <div className='mb-6'>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='p-4 mb-1'
                  name='message'
                  type='text'
                  placeholder='Name'
                />
                {validName && (
                  <p className='text-red-400 text-sm'>Name is required</p>
                )}
              </div>
              <div className='mb-6'>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='p-4 mb-1'
                  name='message'
                  type='text'
                  placeholder='Title'
                />
                {validTitle && (
                  <p className='text-red-400 text-sm'>Title is required</p>
                )}
              </div>
              <div className='mb-6'>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className='p-3'
                  name='message'
                  cols='30'
                  rows='6'
                  placeholder='Message'
                ></textarea>
                {validMessage && (
                  <p className='text-red-400 text-sm'>Message is required</p>
                )}
              </div>
              <button
                type='submit'
                className='bg-[#59cdff] w-full py-2 font-bold text-md rounded-[4px]'
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : null}
      <button
        onClick={() => setShowForm(!showForm)}
        id='featureRequestButton'
        className='cursor-pointer fixed bottom-5 flex items-center justify-center right-5 w-[50px] h-[50px] floating-button rounded-[50px]'
      >
        {showForm ? (
          <i className='fa-regular fa-xmark text-[25px]'></i>
        ) : (
          <i className='fa-light fa-message-dots text-[25px]'></i>
        )}
      </button>
    </>
  );
};

export default FloatingContactForm;
