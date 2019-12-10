import AppContext from './AppContext';

class AppContextProvider extends Component {
  // state = {
  //   cars: {
  //     car001: { name: 'Honda', price: 100 },
  //     car002: { name: 'BMW', price: 150 },
  //     car003: { name: 'Mercedes', price: 200 }
  //   }
  // };

  render() {
    return (
      <AppContext.Provider
        value={{}}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
