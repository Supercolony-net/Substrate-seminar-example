#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[brush::contract]
pub mod usd_token {
    use brush::modifiers;
    use wrapper::traits::usd_token::*;

    #[ink(storage)]
    #[derive(Default, PSP22Storage, PausableStorage)]
    pub struct Contract {
        #[PSP22StorageField]
        psp22: PSP22Data,
        #[PausableStorageField]
        pause: PausableData,
    }

    impl PSP22 for Contract {}

    impl PSP22Internal for Contract {
        /// Return `Paused` error if the token is paused
        #[modifiers(when_not_paused)]
        fn _before_token_transfer(
            &mut self,
            _from: &AccountId,
            _to: &AccountId,
            _amount: &Balance,
        ) -> Result<(), PSP22Error> {
            Ok(())
        }
    }

    impl Pausable for Contract {}

    // It is need only to verify during compilation that `Contract` implements `Pausable` and `PSP22`
    impl UsdToken for Contract {}

    impl Contract {
        #[ink(constructor)]
        pub fn new(total_supply: Balance) -> Self {
            let mut instance = Self::default();
            assert!(instance._mint(Self::env().caller(), total_supply).is_ok());
            instance
        }

        /// Function which changes state to unpaused if paused and vice versa
        #[ink(message)]
        pub fn change_state(&mut self) -> Result<(), PSP22Error> {
            if self.paused() {
                self._unpause()
            } else {
                self._pause()
            }
        }
    }
}
