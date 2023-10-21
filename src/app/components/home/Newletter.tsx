const Newletter = () => {
  return (
    <aside className="bg-red-600 text-white p-5 text-lg">
      <form action="" className="flex">
        <div>
          <h2>Inscrivez vous à notre Newsletter !</h2>
          <p>
            Inscription express, candidature limitée et delai imparti, ne ratez
            pas le train !
          </p>
        </div>
        <div className="flex flex-col float-right w-auto m-auto">
          <label htmlFor="mail" className="flex flex-col">
            Rentrez votre email
            <input type="text" placeholder="Adresse mail" name="mail" required className="rounded-lg"/>
          </label>
          <label htmlFor="checkbox"> 
          <input type="checkbox" id="checkbox" checked name="quotidien" className=""/>
            <span>  </span> Quotidiennements
          </label>
        </div>
      </form>
    </aside>
  );
};

export default Newletter;
