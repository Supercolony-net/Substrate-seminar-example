pub use brush::contracts::traits::psp22::*;
use brush::traits::{
    AccountId,
    Balance,
};

#[brush::wrapper]
pub type WrappedPSP22Ref = dyn WrappedPSP22 + PSP22;

#[brush::trait_definition]
pub trait WrappedPSP22: PSP22 {
    /// Allow a user to deposit `amount` of underlying tokens and mint `amount` of the wrapped tokens to `account`
    #[ink(message)]
    fn deposit_for(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error>;

    /// Allow a user to burn `amount` of wrapped tokens and withdraw the corresponding number of underlying tokens to `account`
    #[ink(message)]
    fn withdraw_to(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error>;
}
