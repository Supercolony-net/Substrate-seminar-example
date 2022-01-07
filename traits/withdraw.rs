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
pub type WithdrawRef = dyn Withdraw;

#[brush::trait_definition]
pub trait Withdraw: PSP22 {
    /// Allow a user to burn `amount` of wrapped tokens and withdraw the corresponding number of underlying tokens to `account`
    #[ink(message)]
    fn withdraw_to(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error>;
}
