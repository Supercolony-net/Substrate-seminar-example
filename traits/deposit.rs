use brush::{
    contracts::traits::{
        psp22::PSP22Error,
    },
    contracts::{
        psp22::*,
    },
    traits::{
        AccountId,
        Balance,
    },
};

#[brush::wrapper]
pub type DepositRef = dyn Deposit;

#[brush::trait_definition]
pub trait Deposit: PSP22 {
    /// Allow a user to deposit `amount` of underlying tokens and mint `amount` of the wrapped tokens to `account`
    #[ink(message)]
    fn deposit_for(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error>;
}
