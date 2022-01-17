That repository contains the structure and integration tests for the `PSP22` USD token and wrapped USD token.
USD token is simple [`PSP22`](https://docs.openbrush.io/smart-contracts/PSP22/psp22) with the ability to [pause](https://docs.openbrush.io/smart-contracts/pausable) transfers. The wrapped USD token is `PSP22` with two additional methods:
```rust
#[brush::trait_definition]
pub trait WrappedPSP22 {
    /// Allow a user to deposit `amount` of underlying tokens and mint `amount` of the wrapped tokens to `account`
    #[ink(message)]
    fn deposit_for(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error>;

    /// Allow a user to burn `amount` of wrapped tokens and withdraw the corresponding number of underlying tokens to `account`
    #[ink(message)]
    fn withdraw_to(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error>;
}
```

The user is able to deposit USD to get a WrappedUSD. The WrappedUSD is a `PSP22` so the user is able to transfer, approve and etc.

To run integration tests you need to install dependency:
```shell
yarn install
cargo +nightly-2021-07-20 install europa --git=https://github.com/patractlabs/europa.git --force --locked
```

Run `substrate` node:
```shell
europa --tmp --dev
```

Run tests:
```shell
yarn test
```

Branches:
- `main` - contains empty structure and tests. The developer should implement contracts by himself. Running of integration tests will help to verify that contracts are implemented right.
- `solution_1` - is an example of how contracts can be implemented with a simple project structure. That structure can be used when the logic of contracts is simple and you don't need interaction between your contracts. [Comparison with `main`](https://github.com/Supercolony-net/Substrate-seminar-example/compare/main...solution_1)
- `solution_2` - is an example of how contracts can be implemented with [default trait implementation](https://docs.openbrush.io/smart-contracts/example/data#default-implementation). That structure can be used if you have heavy logic and you need cross-contract interactions. But you don't plan that someone outside of your project will interact with your contracts. [Comparison with `solution_1`](https://github.com/Supercolony-net/Substrate-seminar-example/compare/solution_1...solution_2)
- `solution_3` - is an example of how contracts can be implemented with [generic implementation](https://docs.openbrush.io/smart-contracts/example/data#default-implementation). It is a universal structure for any kind of project. Traits are defined separately and without stuff related to implementation. That allows other people to easily interact with your contracts. [Comparison with `solution_2`](https://github.com/Supercolony-net/Substrate-seminar-example/compare/solution_2...solution_3)
