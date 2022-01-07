use brush::contracts::psp22::{PSP22Error, PSP22Internal, PSP22Storage};
use brush::contracts::psp22::extensions::wrapper::{PSP22WrapperInternal, PSP22WrapperStorage};
use brush::traits::{AccountId, Balance};
use ink_storage::traits::SpreadLayout;
use crate::traits::deposit::Deposit;

impl<T: PSP22Storage + PSP22WrapperStorage + SpreadLayout> Deposit for T {
    default fn deposit_for(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
        self._deposit(amount)?;
        self._mint(account, amount)
    }
}
